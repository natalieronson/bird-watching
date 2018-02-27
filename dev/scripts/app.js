import React from 'react';
import ReactDOM from 'react-dom';
import BirdItem from './birdItem';
import MainForm from './mainForm';
import FilterForm from './filterForm'

// app.js
var config = {
  apiKey: "AIzaSyDALbypvJ_JfWDGeW7N5RWq438EmzH6Syo",
  authDomain: "bird-app-f0c4d.firebaseapp.com",
  databaseURL: "https://bird-app-f0c4d.firebaseio.com",
  projectId: "bird-app-f0c4d",
  storageBucket: "",
  messagingSenderId: "621864199101"
};
firebase.initializeApp(config);



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
    this.editEntry = this.editEntry.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
    this.filterItems = this.filterItems.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.displayForm = this.displayForm.bind(this);
    this.displayFilter = this.displayFilter.bind(this);
    this.displayHome = this.displayHome.bind(this);
  }

  // componentDidMount() {
  //   firebase.auth().onAuthStateChanged((user) => {
  //     if (user) {
  //       this.setState({
  //         loggedIn: true,
  //         user: user
  //       });
  //     } else {
  //       this.setState({ loggedIn: false });
  //     }
  //   }), () => { console.log(this.state.user)})

  // }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          loggedIn: true,
          user: user
        }, () => { 
          // const dbRef = firebase.database().ref();
          const userDBRef = firebase.database().ref(`users/${this.state.user.uid}/birds`);

          userDBRef.on('value', (snapshot) => {
            const databaseBirds = []
            const data = snapshot.val();
            console.log(data);
            for (let key in data) {
              data[key].id = key;
              console.log(data[key]);
              databaseBirds.push(data[key]);
            }
            console.log(databaseBirds);

            
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


  googleAuthentication() {

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    firebase.auth().signInWithPopup(provider)
    // const provider = new firebase.auth.GoogleAuthProvider();

    // //sign ins return a promise, so we use the .then()
    // firebase.auth().signInWithPopup(provider).then(function (result) {
    //   // This gives you a Google Access Token. You can use it to access the Google API.
    //   const token = result.credential.accessToken;

    //   // Get the signed-in user info.
    //   const user = result.user;
    //   // this.setState({ user: user });
    .catch(function (error) {
      console.log(error)
    });
  }

  signOut(event) {
    event.preventDefault();
    firebase.auth().signOut().then(function (success) {
      console.log('Signed out!')
    }, function (error) {
      console.log(error);
    });
  }

  addBird(e) {
    const birdEntry = {
      species: this.state.species,
      numberSeen: this.state.numberSeen,
      location: this.state.location,
      date: this.state.date,
      notes: this.state.notes,
    }
    e.preventDefault();
    const userID = firebase.auth().currentUser.uid;
    const dbref = firebase.database().ref(`users/${userID}/birds`);
    dbref.push(birdEntry);

    this.setState({
      species: '',
      numberSeen: '',
      location: '',
      notes: ''
    });

  }

  handleChange(e) {
    console.log(e);
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  editEntry(entryKey) {
    // const entryToUpdate = this.state.birdSightings.find((entry) => {
    //   return entry.key === entryKey;
    // });
   
  }

  deleteEntry(entryKey) {
    console.log(entryKey);
    const userID = firebase.auth().currentUser.uid;
    const dbref = firebase.database().ref(`users/${userID}/birds/${entryKey}`);
    dbref.remove()

    // const entryToUpdate = this.state.birdSightings.find((entry) => {
    //   return entry.key === entryKey;
    // });
    // delete entryToUpdate.key;
    // dbref.set(entryToUpdate);
  }

  filterItems(e) {
    e.preventDefault();
    const userDBRef = firebase.database().ref(`users/${this.state.user.uid}/birds`);

    userDBRef.on('value', (snapshot) => {
      const data = snapshot.val();
      // console.log(data);
      const databaseBirds = []
      for (let key in data) {
        data[key].id = key;
        // console.log(data[key]);
        databaseBirds.push(data[key]);
      }
      let filteredArray = databaseBirds;
      console.log(filteredArray);
      if (this.state.speciesFilter !== '') {
        filteredArray = filteredArray.filter((item) => {
          return item.species === this.state.speciesFilter;
        })
      }
      if (this.state.locationFilter !== '') {
        filteredArray = filteredArray.filter((item) => {
          return item.location === this.state.locationFilter;
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
      
      // console.log (date.getTime());
      // console.log(filteredArray);
      this.setState({
        birdSightings: filteredArray
      })
      
    });
    
  }

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
  })
}

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

  displayHome() {
    this.setState({
      displayCards: true,
      displayFilterForm: false,
      displayInputForm: false
    })
  }




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
                  {this.state.birdSightings.map((sighting, i) => {
                    return (
                      <BirdItem data={sighting} key={sighting.key} editEntry={this.editEntry} deleteEntry={this.deleteEntry} />
                    )
                  })}
                  <div className="sighting-title">
                    <h2>Sightings</h2>
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
          
          




          

            
    
        </div>
      )
    }

    
  }


ReactDOM.render(<App />, document.getElementById('app'));
