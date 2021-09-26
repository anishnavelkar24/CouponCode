import React from "react";

const ReadOnlyRow = ({ contact, handleEditClick, handleDeleteClick }) => {
  return (
    <tr>
      <td>{contact.couponCode}</td>
      <td>{contact.discountType}</td>
      <td>{contact.dateOfExpiry}</td>
      <td>{contact.deductable}</td>
      <td>{contact.maxAmount}</td>
      <td>
        <button type="button" onClick={() => handleDeleteClick(contact.id)}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ReadOnlyRow;
