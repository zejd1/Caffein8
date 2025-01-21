import { useAuth } from "../context/AuthContext";
import { calculateCurrentCaffeineLevel, coffeeConsumptionHistory, getCaffeineAmount, timeSinceConsumption } from "../utils";

function History(){
    const {globalData} = useAuth()
    return(
    <>
        <div className='section-header'>
            <i className='fa-solid fa-timeline'/>
            <h2> Your History</h2>
        </div>
        <p><i>Hover for more information</i></p>
        <div className="coffee-history">
            {Object.keys(globalData).sort((a,b) => b-a).map
            ((utcTime, index) => {

                const coffee = globalData[utcTime];
                const timeSinceConsumed = timeSinceConsumption(utcTime);
                const orginalAmount = getCaffeineAmount(coffee.name);
                const remainingAmount = calculateCurrentCaffeineLevel({
                    [utcTime] : coffee
                })

                const summary = `Name: ${coffee.name} | Time: ${timeSinceConsumed} | Cost: $${coffee.cost} | Amount: ${orginalAmount} mg | Remaining: ${remainingAmount} mg`
                return(
                    <div title={summary} key={index}>
                        <i className="fa-solid fa-mug-hot"/>

                    </div>
                )
            })}
        </div>
    </>);
}

export default History