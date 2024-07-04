import React, { useContext, useState } from 'react';
import './reserve.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import useFetch from '../../hooks/useFetch';
import { SearchContext } from '../../context/SearchContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Reserve({ setOpen, hotelId }) {
    const [selected, setSelected] = useState([]);
    const { data, loading, error } = useFetch(`http://localhost:8800/api/hotels/room/${hotelId}`);
    const { dates } = useContext(SearchContext);
    const navigate = useNavigate();

    const handleSelect = (e) => {
        const checked = e.target.checked;
        const value = e.target.value;
        setSelected(checked ? [...selected, value] : selected.filter(item => item !== value));
    };

    const getDatesInRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const date = new Date(start.getTime());
        const dates = [];

        while (date <= end) {
            dates.push(new Date(date).getTime());
            date.setDate(date.getDate() + 1);
        }

        return dates;
    };

    const allDates = getDatesInRange(dates[0].startDate, dates[0].endDate);

    const isAvailable = (roomNumber) => {
        const isFound = roomNumber.unavailableDates.some(date => allDates.includes(new Date(date).getTime()));
        return !isFound;
    };

    const handleClick = async () => {
        try {
            await Promise.all(selected.map(roomId => {
                const res = axios.put(`http://localhost:8800/api/rooms/availability/${roomId}`, { dates: allDates });
                return res.data;
            }));
            setOpen(false);
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='reserve'>
            <div className="rContainer">
                <FontAwesomeIcon icon={faCircleXmark} className='rClose' onClick={() => setOpen(false)} />
                <span>Select your rooms</span>
                {data.map(item => (
                    <div className="rItem" key={item._id}>
                        <div className="rIteminfo">
                            <div className="rTitle">{item.title}</div>
                            <div className="rDesc">{item.desc}</div>
                            <div className="rMaxpeople">Max People: <b>{item.maxPeople}</b></div>
                            <div className="rDesc">Per room: <b>${item.price}</b></div>
                        </div>
                        <div className="rSelectRooms">
                            {item.roomNumbers.map(roomNumber => (
                                <div className="room" key={roomNumber._id}>
                                    <label className="custom-checkbox">
                                        <input
                                            type="checkbox"
                                            value={roomNumber._id}
                                            onChange={handleSelect}
                                            disabled={!isAvailable(roomNumber)}
                                        />
                                        <span className="checkmark"></span>
                                        <span className="custom-checkbox-label">{roomNumber.number}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <button onClick={handleClick} className="rButton">Reserve Now</button>
            </div>
        </div>
    );
}

export default Reserve;
