import React from "react";
import axios from "axios";
// import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
// //import session from "express-session";

// const Home = () => <h1>Home</h1>;
// const About = () => <h1>About</h1>;

//import OneRestaurent from "./OneRestaurant";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.reviewSubmitHandler = this.reviewSubmitHandler.bind(this);

    this.state = {
      email: "",
      password: "",
      restaurants: [],
      reviewText: "",
      restaurantId: "",
      filter: "",
      singleResto: {},
    };
  }
  loginHandler = (event) => {
    event.preventDefault();
    var loginData = {
      email: this.state.email,
      password: this.state.password,
    };

    axios.post(`http://localhost:3000/login`, loginData).then((res) => {
      console.log(res);

      console.log(res.data);

      if (res.status === 200) {
        console.log("Changing route to profile or home page");
      }
    });
  };

  reviewSubmitHandler = (_id, event) => {
    event.preventDefault();
    console.log("Review submission initialized");

    alert(this.state.reviewText);

    var reviewData = {
      reviewtext: this.state.reviewText,
      userId: "5e85e4b2fecb9320dc4f9324",
      restaurantId: _id,
    };
    console.log(reviewData);

    axios.post(`http://localhost:3000/review`, reviewData).then((res) => {
      console.log(res);
      console.log(res.data);
    });
  };

  componentDidMount() {
    axios.get(`http://localhost:3000/restaurant`).then((res) => {
      const restaurants = res.data;
      this.setState({ restaurants });
    });

    axios.get(`http://localhost:3000/`).then((res) => {
      console.log("Main Routes response");

      console.log(res);
    });
  }

  reviewTexthandler = (event) => {
    this.setState({
      reviewText: event.target.value,
    });
  };

  loginEmailHandler = (event) => {
    this.setState({ email: event.target.value });
  };
  loginPasswordHandler = (event) => {
    this.setState({ password: event.target.value });
  };

  searchRest = (event) => {
    this.setState({
      filter: event.target.value,
    });
  };

  // getFaltuData = () => {
  //   axios.get(`http://localhost:3000/`).then(res => {
  //     console.log(res);
  //   });
  // };
  render() {
    const lowercasedFilter = this.state.filter.toLowerCase();
    const filteredData = this.state.restaurants.filter((item) => {
      return Object.keys(item).some((key) =>
        item.name.toLowerCase().includes(lowercasedFilter)
      );
    });
    return (
      <div className="main container">
        <form onSubmit={this.loginHandler}>
          <input
            type="email"
            name="email"
            placeholder="email"
            onChange={this.loginEmailHandler}
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            onChange={this.loginPasswordHandler}
          />
          <input type="submit" />
        </form>

        <div>
          <p>faltu get data from other route</p>
        </div>

        <br></br>
        <br></br>
        <br></br>
        <div className="restaurants">
          <input
            type="text"
            id="myInput"
            placeholder="Search for Restaurants ..."
            onKeyUp={this.searchRest}
          />

          <br></br>
          <br></br>
          <br></br>
          <ul>
            {filteredData.map((restaurant) => (
              <div key={restaurant.name} data-id={restaurant._id} id="myUL">
                <h4>
                  <button
                    className="btn"
                    onClick={() => this.setState({ singleResto: restaurant })}
                  >
                    {restaurant.name}
                  </button>
                </h4>
              </div>
            ))}
          </ul>
        </div>

        <br></br>
        <p>Capacity : {singleResto.capacity} </p>
        <ul>
          Menu:
          {singleResto.menu.map((menuItem) => (
            <li key={menuItem._id}>
              {menuItem.name} :: {menuItem.price}
            </li>
          ))}
        </ul>
        <p>cuisines : {singleResto.capacity}</p>
        <p>
          Location : ({singleResto.location[0].let},
          {singleResto.location[0].long})
        </p>
        <div>
          <div>
            Reviews :
            {singleResto.review.map((oneReview) => (
              <p key={oneReview._id}>
                {oneReview.description} By {oneReview.name} at
                {oneReview.timeOfReview}
              </p>
            ))}
          </div>
          <form onSubmit={this.reviewSubmitHandler.bind(this, singleResto._id)}>
            <input
              type="text"
              name="reviewtext"
              placeholder="Write your review here"
              onChange={this.reviewTexthandler}
            />
            <input type="submit" />
          </form>
        </div>
      </div>
    );
  }
}

export default App;
