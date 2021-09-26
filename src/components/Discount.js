import React, { Component } from "react";
import { connect } from "react-redux";
//import { addShipping } from './actions/cartActions'
import axios from "axios";

let responseData = null;
class Discount extends Component {
  axios = require("axios");

  constructor() {
    super();
    this.state = {
      discountCouponCode: null,
      discountAdded: false,
      couponAdded: [],
    };
  }
  componentWillUnmount() {
    if (this.refs.shipping.checked) this.props.subtractShipping();
  }

  handleChecked = (e) => {
    if (e.target.checked) {
      this.props.addShipping();
    } else {
      this.props.subtractShipping();
    }
  };

  handleDiscountChange = (e) => {
    this.setState({
      discountCouponCode: e.target.value,
      discountAdded: false,
    });
  };

  handleDiscount = (e) => {
    console.log("here" + this.state.couponAdded);
    if (!this.state.discountAdded) {
      var check = false;
      for (var code in this.state.couponAdded) {
        console.log(this.state.couponAdded[code]);
        if (this.state.couponAdded[code] === this.state.discountCouponCode) 
        { 
          check = true;
          break;
        }
      }
      if (!check) {
        try {
          axios
            .post("http://localhost:8000/checkCouponCode", {
              code: this.state.discountCouponCode,
            })
            .then((response) => {
              console.log(response.data);
              if (response.data !== "failed") {
                var date = new Date();
                var couponDate = new Date(response.data.dateOfExpiry);
                console.log(date.toString());
                console.log(couponDate.toString());
                if (date.getTime() <= couponDate.getTime()) {
                  responseData = response.data;
                  let tempArray = this.state.couponAdded;
                  tempArray.push(this.state.discountCouponCode);
                  this.setState({
                    discountAdded: true,
                    couponAdded: tempArray,
                  });
                  this.props.addDiscount();
                } else alert("Invalid coupon code: coupon Expired ");
              } else alert("Invalid coupon code: ");
            });
        } catch (error) {
          console.error(error);
        }
      }else alert("coupon code already added");
    }
  };

  render() {
    return (
      <div className="container">
        <div className="collection">
          <li className="collection-item">
            <label>
              <input
                type="checkbox"
                ref="shipping"
                onChange={this.handleChecked}
              />
              <span>Shipping(+50 &#8377;)</span>
            </label>
          </li>
          <li className="collection-item">
            <label>
              <input
                type="text"
                ref="discount"
                onChange={this.handleDiscountChange}
              />
              <span>Shipping(+50 &#8377;)</span>
            </label>
            <button
              onClick={() => {
                this.handleDiscount();
              }}
              className="waves-effect waves-light btn"
            >
              Add Coupon Code
            </button>
          </li>
          <li className="collection-item">
            <b>Total: {this.props.total} &#8377;</b>
          </li>
        </div>
        <div className="checkout">
          <button className="waves-effect waves-light btn">Checkout</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    addedItems: state.addedItems,
    total: state.total,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addShipping: () => {
      dispatch({ type: "ADD_SHIPPING" });
    },
    subtractShipping: () => {
      dispatch({ type: "SUB_SHIPPING" });
    },
    addDiscount: () => {
      dispatch({
        type: "ADD_DISCOUNT",
        amount: responseData.deductable,
        discountType: responseData.discountType,
        maxAmount: responseData.maxAmount,
      });
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Discount);
