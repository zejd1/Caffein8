import { useAuth } from '../context/AuthContext';
import {coffeeOptions} from '../utils'
import Authentication from "./Authentication";
import Modal from "./Modal";
import { useState } from "react";
import {doc, setDoc} from "firebase/firestore"
import { db } from '../../Firebase';

function CoffeeForm(props){
    const { isAuthenticated } = props;
    const [showModal, setShowModal] = useState(false);
    const [selectedCoffee, setSelectedCoffee] = useState(null);
    const [showCoffeeTypes, setShowCoffeeTypes] = useState(false);
    const [coffeeCost, setCoffeeCost] = useState(0);
    const [hour, setHour] = useState(0);
    const [min, setMin] = useState(0);

    const {globalData, setGlobalData, globalUser} = useAuth()

    async function handleSubmitForm() {
        if (!isAuthenticated) {
            setShowModal(true)
            return
        }

        // define a guard clause that only submits the form if it is completed
        if (!selectedCoffee) {
            return
        }

        try {
            // then we're going to create a new data object
            const newGlobalData = {
                ...(globalData || {})
            }

            const nowTime = Date.now()
            const timeToSubtract = (hour * 60 * 60 * 1000) + (min * 60 * 1000)
            const timestamp = nowTime - timeToSubtract

            const newData = {
                name: selectedCoffee,
                cost: coffeeCost
            }
            newGlobalData[timestamp] = newData
            console.log(timestamp, selectedCoffee, coffeeCost)

            // update the global state
            setGlobalData(newGlobalData)

            // persist the data in the firebase firestore
            const userRef = doc(db, 'users', globalUser.uid)
            const res = await setDoc(userRef, {
                [timestamp]: newData
            }, { merge: true })

            setSelectedCoffee(null)
            setHour(0)
            setMin(0)
            setCoffeeCost(0)
        } catch (err) {
            console.log(err.message)
        }
    }

    function handleCloseModal() {
        setShowModal(false)
    }
    return(
    <>
        {showModal && 
            (<Modal handleCloseModal={handleCloseModal}>
                <Authentication handleCloseModal={handleCloseModal}/>
            </Modal>)}
            
        <div className="section-header">
            <i className="fa-solid fa-pencil"></i>
            <h2>Start Tracking Today</h2>
        </div>
        <h4>Select Caffeine Type</h4>
        <div className="coffee-grid">
            {coffeeOptions.slice(0,5).map((option, optionIndex) => {
                return(
                    <button onClick={() =>{
                        setSelectedCoffee(option.name)
                        setShowCoffeeTypes(false)
                    }} className={'button-card ' + (option.name === selectedCoffee ? 'coffee-button-selected' : '')} key={optionIndex}>
                        <h4>{option.name}</h4>
                        <p>{option.caffeine} mg</p>
                    </button>
                )
            })}
            <button onClick={() => {
                setShowCoffeeTypes(true);
                setSelectedCoffee(null)
            }} className={'button-card ' + (showCoffeeTypes ? 'coffee-button-selected' : '')}>
                <h4>Other</h4>
                <p>n/a</p>
            </button>
        </div>
        {showCoffeeTypes && (
                <select onChange={(e) => {
                    setSelectedCoffee(e.target.value)
                }} id='coffee-list' name='coffee-list'>
                    <option value={null}>Select Type</option>
                    {coffeeOptions.map((option, optionIndex) => {
                        return(
                            <option value={option.name} key={optionIndex}> 
                                {option.name} ({option.caffeine}mg)
                            </option>
                        )
                    })}
                </select>)}

        <h4>Calculate The Cost</h4>
        <input  name="coffeeCost" className='w-full' placeholder='4.99' type='number' value={coffeeCost} onChange={(e) =>{
            setCoffeeCost(e.target.value)
        }}></input>

        <h4>Time Since Consumption</h4>
        <div className='time-entry'>
            <div>
                <h4>Hours</h4>
                <select onChange={(e) => {
                    setHour(e.target.value)
                }} id='hours-selected'>
                    {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map((hours,hourIndex) => {
                        return(
                            <option key={hourIndex} value={hours}>{hours}</option>
                        );
                    })}
                </select>
            </div>
            <div>
                <h4>Minutes</h4>
                <select onChange={(e) => {
                    setMin(e.target.value)
                }} id='mins-selected'>
                    {[0,5,10,15,30,45].map((mins,minIndex) => {
                        return(
                            <option key={minIndex} value={mins}>{mins}</option>
                        );
                    })}
                </select>
            </div>
        </div>
        <button onClick={handleSubmitForm}>Add Entry</button>
    </>);
}

export default CoffeeForm