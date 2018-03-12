import React from 'react';
import ReactDOM from 'react-dom';
import BirdItem from './birdItem';
import MainForm from './mainForm';
import FilterForm from './filterForm'

var config = {
  apiKey: "AIzaSyDALbypvJ_JfWDGeW7N5RWq438EmzH6Syo",
  authDomain: "bird-app-f0c4d.firebaseapp.com",
  databaseURL: "https://bird-app-f0c4d.firebaseio.com",
  projectId: "bird-app-f0c4d",
  storageBucket: "bird-app-f0c4d.appspot.com",
  messagingSenderId: "621864199101"
};
firebase.initializeApp(config);



/**
 * Main app component
 */
class App extends React.Component {
  
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      user: null,
      species: '',
      numberSeen: '',
      location: '',
      date: '',
      notes: '',
      file: '',
      birdSightings: [],
      speciesFilter: '',
      locationFilter: '',
      dateFilterStart: '',
      dateFilterEnd: '',
      displayInputForm: false,
      displayFilterForm: false,
      displayCards: true
    }
    this.googleAuthentication = this.googleAuthentication.bind(this);
    this.signOut = this.signOut.bind(this);
    this.addBird = this.addBird.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
    this.filterItems = this.filterItems.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.displayForm = this.displayForm.bind(this);
    this.displayFilter = this.displayFilter.bind(this);
    this.displayHome = this.displayHome.bind(this);
  }



/**
 * Monitors changes in user login status and sets the state accordingly
 */
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          loggedIn: true,
          user: user
        }, () => { 
          const userDBRef = firebase.database().ref(`users/${this.state.user.uid}/birds`);

          userDBRef.on('value', (snapshot) => {
            const databaseBirds = []
            const data = snapshot.val();
            for (let key in data) {
              data[key].id = key;
              databaseBirds.push(data[key]);
            }
            this.setState({
              birdSightings: databaseBirds
            })
          });
        });
      }
      else {
        this.setState({
          loggedIn: false
        })
      }
    })
  }

  /**
   * Authenticates users using google authentication
   */
  googleAuthentication() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    firebase.auth().signInWithPopup(provider)
    .catch(function (error) {
      console.log(error)
    });
  }

  /**
   * Signs the user out
   * @param {e} event - Accepts an event triggered by clicking the signOut button
   */
  signOut(event) {
    event.preventDefault();
    firebase.auth().signOut().then(function (success) {
      console.log('Signed out!')
    }, function (error) {
      console.log(error);
    });
  }

  /**
   * Creates an object containing the values of the form inputs when the user submits the form
   * If the user has uploaded a file, will also add the file to the object
   * Adds the object to the database
   * Clears the values from the input form
   * @param {*event} e - Accepts an event that is triggered by the user clicking the button to add a bird
   */
  addBird(e) {  
    e.preventDefault();
    
    const birdEntry = {
      species: this.state.species,
      speciesSearch: this.state.species.toLowerCase(),
      numberSeen: this.state.numberSeen,
      location: this.state.location,
      locationSearch: this.state.location.toLowerCase(),
      date: this.state.date,
      notes: this.state.notes
    }

    const userID = firebase.auth().currentUser.uid;
    const dbref = firebase.database().ref(`users/${userID}/birds`);

    let file = document.getElementById('file').files[0];
    if (file) {
      var storageRef = firebase.storage().ref();
      const image = storageRef.child(file.name);
      image.put(file).then((snapshot) => {
        image.getDownloadURL().then((url) => {
        birdEntry.file = url
        dbref.push(birdEntry);
        })
      })
    }
    else {
      dbref.push(birdEntry);
    }

    this.setState({
      species: '',
      numberSeen: '',
      location: '',
      notes: '',
      file: ''
    });

  }

  /**
   * Sets the state of the inputs to equal the entered values
   * @param {*event} e - Accepts an event when that is triggered when change occurs in the input fields
   */
  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  /**
   * Deletes the entry from the database that is associated with the passed entry key
   * @param {*} entryKey - Accepts the entry key that is passed when the user clicks the delete button
   */
  deleteEntry(entryKey) {
    const userID = firebase.auth().currentUser.uid;
    const dbref = firebase.database().ref(`users/${userID}/birds/${entryKey}`);
    dbref.remove();
  }

  /**
   * Retrieves all bird objects from the database
   * Checks if the user has entered any filter parameters and if so, returns items that match these parameters
   * Sets the state to the filtered array
   * @param {*} e - Accepts an event that is triggered when the user clicks the filter button
   */
  filterItems(e) {
    e.preventDefault();
    const userDBRef = firebase.database().ref(`users/${this.state.user.uid}/birds`);

    userDBRef.on('value', (snapshot) => {
      const data = snapshot.val();
      const databaseBirds = []
      for (let key in data) {
        data[key].id = key;
        databaseBirds.push(data[key]);
      }
      let filteredArray = databaseBirds;
      if (this.state.speciesFilter !== '') {
        filteredArray = filteredArray.filter((item) => {
          return item.speciesSearch === this.state.speciesFilter.toLowerCase();
        })
      }
      if (this.state.locationFilter !== '') {
        filteredArray = filteredArray.filter((item) => {
          return item.locationSearch === this.state.locationFilter.toLowerCase();
        })
      }
      if (this.state.dateFilterStart && this.state.dateFilterEnd) {
        let startDate = new Date(this.state.dateFilterStart);
        let endDate = new Date(this.state.dateFilterEnd);
        filteredArray = filteredArray.filter((item) => {
          let currDate = new Date(item.date);
          return currDate.getTime() >= startDate.getTime() && currDate.getTime() <= endDate.getTime();
        })
      }
      
      this.setState({
        birdSightings: filteredArray
      })

      document.querySelector('.sightingsContainer').scrollIntoView({
        behavior: 'smooth',
      })
      
    });
    
  }

  /**
   * Retrieves all the birds from the database and sets the state so they are all displayed
   * Removes the values from the filter inputs
   */
  resetFilters() {
    const userDBRef = firebase.database().ref(`users/${this.state.user.uid}/birds`);
    userDBRef.on('value', (snapshot) => {
      let databaseBirds = [];
      const data = snapshot.val();
      for (let key in data) {
        data[key].id = key;
        databaseBirds.push(data[key]);
      }

      this.setState({
        birdSightings: databaseBirds,
        speciesFilter: '',
        locationFilter: '',
        dateFilterStart: '',
        dateFilterEnd: ''
      })

      setTimeout(function() {
        window.scroll(0, 0);
        document.querySelector('.toggle-button-container').scrollIntoView({
        behavior: 'smooth',
        })
      }, 10);
      
  })
}

  /**
   * Sets the state to display the form to add new birds
   */
  displayForm() {
    (this.state.displayInputForm) ? this.setState({
      displayInputForm: false,
      displayCards: true
    })
    : this.setState({
      displayInputForm: true,
      displayFilterForm: false,
      displayCards: false
    })
  }

  /**
   * Sets the state to display the filter form
   */
  displayFilter() {
    (this.state.displayFilterForm) ? this.setState({
      displayFilterForm: false,
      displayCards: true
    })
      : this.setState({
        displayCards: true,
        displayFilterForm: true,
        displayInputForm: false
      })
  }

  /**
   * Sets the state to display the main page
   */
  displayHome() {
    this.resetFilters();
    this.setState({
      displayCards: true,
      displayFilterForm: false,
      displayInputForm: false
    })
  }

    /**
     * The main render method for App
     */
    render() {
      return (
        <div className="main-container">
       
          {(this.state.loggedIn) ?
          <div>
            <nav>
              <div className="toggle-button-container">
                <button onClick={this.displayHome}>Home</button>
                <button onClick={this.displayForm}>Add new sighting</button>
                <button onClick={this.displayFilter}>Filter</button>
              </div>
                <button onClick={this.signOut}>Sign out</button>
             </nav>
              {(this.state.displayInputForm) ?
                <div className="main-bird-container">
                <MainForm data={this.state} addBird={this.addBird} handleChange={this.handleChange} />
                </div>
                :
                null
              }
              {(this.state.displayFilterForm) ?
                <FilterForm data={this.state} handleChange={this.handleChange} filterItems={this.filterItems} resetFilters={this.resetFilters} />
                :
                null
              }
             {(this.state.displayCards)?
                <div className="sightingsContainer">
                  {/* <footer><p>Icons by Iconic from the Noun Project</p></footer> */}
                  {this.state.birdSightings.map((sighting, i) => {
                    return (
                      <BirdItem data={sighting} key={sighting.key} editEntry={this.editEntry} deleteEntry={this.deleteEntry} />
                    )
                  })}
                  <div className="sighting-title">
                    <img src="images/birdtwo.svg" alt=""/>
                    <h2>Sightings</h2>
                    <img src="images/bird.svg" alt=""/>
                  </div>
                </div>
                :null
              }
          </div>
            : <div className="login-wrapper">
                <div className="login-page">
                  <h1>Your bird watching journal</h1>
                  <h3>Record birds you see and tracks your stats</h3>
                  <button onClick={this.googleAuthentication}>Sign in</button>
                </div>
              </div>
          }
          <footer><p>Icons by Iconic from the Noun Project</p></footer>
        </div>
      )
    }

    
  }


ReactDOM.render(<App />, document.getElementById('app'));
