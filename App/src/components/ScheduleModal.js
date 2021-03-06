/* eslint-disable no-unused-expressions */
/** @jsx jsx */
import { jsx } from "@emotion/core";
import React, { useState } from "react";
import Modal from "react-modal";
import Calendar from "./Calendar";
import { useUser } from "../contexts/user";
import { createRequest } from "../services/request";
import Alert from "../components/Alert";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)"
  }
};

function ScheduleModal({
  isOpen,
  onRequestClose,
  workShiftConcat,
  frontdesks,
  calcDay,
  start,
  end
}) {
  const user = useUser();
  const [alert, setAlert] = useState("");
  const [shiftsClicked, setShiftsClicked] = useState([]);
  const [newMotive, setMotive] = useState("");

  const cancel = {
    fontSize: "2em",
    cursor: "pointer",
    color: "rgb(24, 116, 140)",
    fontWeight: "bolder",
    "&:hover": {
      color: "rgb(24, 116, 140"
    }
  };

  const container = {
    display: "flex",
    flexDirection: "column"
  };

  const head = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  };

  const footer = {
    display: "flex",
    justifyContent: "flex-end"
  };

  const textareaCss = {
    rows: 4,
    cols: 50
  };

  const listCss = {
    listStyleType: "none",
    padding: 0
  };

  const formCss = {
    display: "flex",
    flexDirection: "column"
  };

  function nameFrontDesk(userId) {
    return frontdesks.find(frontdesk => frontdesk.id === parseInt(userId)).name;
  }

  function clear() {
    setShiftsClicked([]);
    setMotive("");
  }

  function onRequestClear(event) {
    event.preventDefault();
    clear();
  }
  function onClose(event) {
    event.preventDefault();
    clear();
    onRequestClose();
  }

  function handleChangeMotive(event) {
    setMotive(event.target.value);
  }

  function handleCreateRequest(event) {
    event.preventDefault();
    if (!newMotive) {
      setAlert("Must add a motive");
      return;
    }
    if (shiftsClicked.length < 2) {
      setAlert("Must select a workshift");
      return;
    }
    const request = {
      creationDate: new Date(),
      requester_id: shiftsClicked[0].id,
      requested_id: shiftsClicked[1].id,
      date_Shift: shiftsClicked[1].date,
      current_Shift_id: shiftsClicked[0].shift_id,
      requested_Shift_id: shiftsClicked[1].shift_id,
      motive: newMotive
    };

    try {
      createRequest(request)
        .then(() => clear())
        .then(() => onRequestClose());
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Example Modal"
      ariaHideApp={isOpen}
    >
      <div css={container}>
        <div css={head}>
          <h2>Schedule Change</h2>
          <span
            onClick={onClose}
            css={cancel}
            aria-label="Close schedule modal"
          >
            &times;
          </span>
        </div>
        <Calendar
          workShiftConcat={workShiftConcat}
          frontdesks={frontdesks}
          calcDay={calcDay}
          start={start}
          end={end}
          shiftsClicked={shiftsClicked}
          saveShiftsClicked={setShiftsClicked}
        />
        <div>
          <form css={formCss}>
            <ul css={listCss}>
              {shiftsClicked.map(shift => (
                <li>
                  {nameFrontDesk(shift.id) +
                    " of shift " +
                    shift.shift_id +
                    " of date " +
                    shift.date}
                </li>
              ))}
            </ul>
            <div css={{ display: "flex", flexDirection: "column" }}>
              <span css={{ fontWeight: "bold" }}> Motive: </span>
              <textarea
                css={textareaCss}
                type="text"
                value={newMotive}
                onChange={handleChangeMotive}
              />
            </div>
          </form>
        </div>
        <div css={footer}>
          <button type="button" onClick={onRequestClear}>
            Clear
          </button>
          <button type="button" onClick={handleCreateRequest}>
            Send
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ScheduleModal;
