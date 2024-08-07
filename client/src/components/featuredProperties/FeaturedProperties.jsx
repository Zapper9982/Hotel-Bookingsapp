import "./featuredProperties.css";
import useFetch from "../../hooks/useFetch";
const FeaturedProperties = () => {

  const {data,loading,error} = useFetch("http://localhost:8800/api/hotels?featured=true");

  
  return (
    <div className="fp">
      {loading ? ("Loading please wait") : (<>{data.map((item)=>(<div className="fpItem" key={item}>
        <img
          src={item.photos[0]}
          className="fpImg"
        />
        <span className="fpName">{item.name}</span>
        <span className="fpCity">{item.city}</span>
        <span className="fpPrice">Starting from ${item.cheapestPrice}</span>
        <div className="fpRating">
          <button>8.9</button>
          <span>Excellent</span>
        </div>
      </div>))} 
     </>)}
     
    </div>
  );
};

export default FeaturedProperties;
