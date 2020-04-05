import React from "react";

class OneRestaurant extends React.Component {
  constructor(props) {
    super(props);
    // this.reviewSubmitHandler = this.reviewSubmitHandler.bind(this);

    this.state = {
      user: "",
      restaurant: {}
    };
  }

  render() {
    return (
      <div>
        <h4>{restaurant.name}</h4>
        <p>Capacity : {restaurant.capacity} </p>
        <ul>
          Menu:
          {restaurant.menu.map(menuItem => (
            <li key={menuItem._id}>
              {menuItem.name} :: {menuItem.price}
            </li>
          ))}
        </ul>
        <p>cuisines : {restaurant.capacity}</p>
        <p>
          Location : ({restaurant.location[0].let},{restaurant.location[0].long}
          )
        </p>
        <div>
          <div>
            Reviews :
            {restaurant.review.map(oneReview => (
              <p key={oneReview._id}>
                {oneReview.description} By {oneReview.name} at
                {oneReview.timeOfReview}
              </p>
            ))}
          </div>
          <form onSubmit={this.reviewSubmitHandler.bind(this, restaurant._id)}>
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

export default OneRestaurant;
