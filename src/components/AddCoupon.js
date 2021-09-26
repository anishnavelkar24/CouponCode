import React, { Component } from "react";
import ReadOnlyRow from "./actions/ReadOnlyRow";
import { nanoid } from "nanoid";
import axios from "axios";

class AddCoupon extends Component {
  axios = require("axios");

  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      addFormData: {
        couponCode: "",
        discountType: "",
        dateOfExpiry: "",
        deductable: "",
        maxAmount:""
      },
    };
  }

  async getCoupons() {
    try {
      axios.get("http://localhost:8000/getCoupon").then((response) => {
        console.log(JSON.parse(JSON.stringify(response.data)));
        this.setState({ contacts: JSON.parse(JSON.stringify(response.data)) });
        // console.log(this.state.contacts);
      });
    } catch (error) {
      console.error(error);
    }
  }

  componentDidMount() {
    this.getCoupons();
  }

  handleAddFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...this.state.addFormData };
    newFormData[fieldName] = fieldValue;

    this.setState({
      addFormData: newFormData,
    });
    console.log(newFormData);
    console.log(this.state.addFormData);
  };

  handleAddFormSubmit = (event) => {
    event.preventDefault();

    if (
      this.state.addFormData.discountType.toLowerCase() === "flat" ||
      this.state.addFormData.discountType.toLowerCase() === "percentage"
    ) {
      const newContact = {
        id: nanoid(),
        couponCode: this.state.addFormData.couponCode,
        discountType: this.state.addFormData.discountType.toLowerCase(),
        dateOfExpiry: this.state.addFormData.dateOfExpiry,
        deductable: this.state.addFormData.deductable,
        maxAmount:this.state.addFormData.maxAmount,
      };

      const newContacts = [...this.state.contacts, newContact];
      this.setState({
        contacts: newContacts,
      });

      console.log(this.state.contacts);

      try {
        axios
          .post("http://localhost:8000/addCoupon", newContacts)
          .then((response) => console.log(response.data));
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("discount type only accepts 'flat' or 'percentage'");
    }
  };

  handleDeleteClick = (contactId) => {
    const newContacts = [...this.state.contacts];

    const index = this.state.contacts.findIndex(
      (contact) => contact.id === contactId
    );

    newContacts.splice(index, 1);

    this.setState({
      contacts: newContacts,
    });

    console.log("here" + newContacts);

    try {
      axios
        .post("http://localhost:8000/addCoupon", newContacts)
        .then((response) => console.log(response.data));
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <div className="app-container">
        <form onSubmit={this.handleEditFormSubmit}>
          <table>
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Discount Type</th>
                <th>Expiry Date</th>
                <th>Deductable</th>
                <th>Max Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.contacts.map((contact) => (
                <ReadOnlyRow
                  contact={contact}
                  handleEditClick={this.handleEditClick}
                  handleDeleteClick={this.handleDeleteClick}
                />
              ))}
            </tbody>
          </table>
        </form>

        <h2>Add a Coupon</h2>
        <form onSubmit={this.handleAddFormSubmit}>
          <input
            type="text"
            name="couponCode"
            required="required"
            placeholder="Enter a Code"
            onChange={this.handleAddFormChange}
          />

          <input
            type="text"
            name="discountType"
            required="required"
            placeholder="Discount Type (Eg:flat or percentage)"
            onChange={this.handleAddFormChange}
          />
          <input
            type="number"
            name="deductable"
            required="required"
            placeholder="Percentage/Flat Amount"
            onChange={this.handleAddFormChange}
          />
          <input
            type="number"
            name="maxAmount"
            required="required"
            placeholder="Maximum Deductable"
            onChange={this.handleAddFormChange}
          />
          <input
            type="date"
            name="dateOfExpiry"
            required="required"
            placeholder="Expiry Date"
            onChange={this.handleAddFormChange}
          />
          <button type="submit">Add</button>
        </form>
      </div>
    );
  }
}

export default AddCoupon;
