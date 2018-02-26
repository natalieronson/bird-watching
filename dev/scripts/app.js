import React from 'react';
import ReactDOM from 'react-dom';
import BirdItem from './birdItem';
import MainForm from './mainForm';

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
      dateFilterEnd: ''
    }
    this.googleAuthentication = this.googleAuthentication.bind(this);
    this.signOut = this.signOut.bind(this);
    this.addBird = this.addBird.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.editEntry = this.editEntry.bind(this);
    this.deleteEntry = this.deleteEntry.bind(this);
    this.filterItems = this.filterItems.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
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
    })
  }


  googleAuthentication() {
    const provider = new firebase.auth.GoogleAuthProvider();

    //sign ins return a promise, so we use the .then()
    firebase.auth().signInWithPopup(provider).then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const token = result.credential.accessToken;

      // Get the signed-in user info.
      const user = result.user;
      // this.setState({ user: user });
    }).catch(function (error) {
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
        birdSightings: databaseBirds
      })
  })
}




    render() {
      return (
        <div>

          <button onClick={this.googleAuthentication}>Sign in</button>
          <button onClick={this.signOut}>Sign out</button>
          {/* <form action="" onSubmit={this.addBird}>
            <label htmlFor="species">Species</label>
            <input type="text" value={this.state.species} id="species" onChange={this.handleChange} />
            <label htmlFor="numberSeen">Number of birds seen</label>
            <input type="number" value={this.state.numberSeen} id="numberSeen" onChange={this.handleChange} />
            <label htmlFor="location">Location</label>
            <input type="text" value={this.state.location} id="location" onChange={this.handleChange} />
            <label htmlFor="date">Date</label>
            <input type="date" value={this.state.date} id="date" onChange={this.handleChange} />
            <label htmlFor="notes">Notes</label>
            <textarea value={this.state.notes} id="notes" onChange={this.handleChange}></textarea>
            <input type="submit" value="Submit" />
          </form> */}

          <MainForm data={this.state} addBird={this.addBird} handleChange={this.handleChange}/>

          <form action="" onSubmit={this.filterItems}>
            <h2>Filter data</h2>
            <label htmlFor="speciesFilter">Species</label>
            <input type="text" id="speciesFilter" onChange={this.handleChange} />
            <label htmlFor="locationFilter">Location</label>
            <input type="text" id="locationFilter" onChange={this.handleChange} />
            <label htmlFor="dateFilterStart">Start date</label>
            <input type="date" id="dateFilterStart" onChange={this.handleChange} />
            <label htmlFor="dateFilterEnd"></label>
            <input type="date" id="dateFilterEnd" onChange={this.handleChange} />
            <input type="submit"/>
          </form>

          <button onClick={this.resetFilters}>Reset Filters</button>

          {this.state.birdSightings.map((sighting, i) => {
            return (
              <BirdItem data={sighting} key={sighting.key} editEntry = {this.editEntry} deleteEntry={this.deleteEntry} />
            )
          })}
        </div>
      )
    }

    
  }


ReactDOM.render(<App />, document.getElementById('app'));
