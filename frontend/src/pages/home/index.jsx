import { useEffect , useState} from "react";
import { useAuthStore } from "../../store/useAuthStore";
import NavBar from '../../components/Navbar';
import ImageSlider from "./ImageSlider";
import { SliderData } from "./sliderData.js";
import './home.css';
import aboutimg from '../../assets/IMG_501.avif';
import foodstock from '../../assets/foodstock.png';
import foodimg from '../../assets/IMG_503.jpeg';
import FormExample from './contactForm';
import Feedback from "react-bootstrap/esm/Feedback.js";
import FeedbackForm from "./feedbackpage.js";
import Footer from "../../components/Footer.js";
import App from "./FeedbackCarousel.jsx";
import axios from 'axios';

const Home = () => {
 
  const [feedbackList, setFeedbackList] = useState([]);
  const getAllFeedbacks = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/feedback/approved-list");
        setFeedbackList(response.data.feedbacks)
      console.log("@@@@@@@")
      console.log(response.data.feedbacks)
      console.log("@@@@@@@")
      } catch (error) {
        console.error(error);
      }
    };
  
  
    useEffect(() => {
      getAllFeedbacks();
    }, []);

  return (
    <div style={{backgroundColor:'black'}}>
      <NavBar />

      <div className="welcome"><br></br><br></br><br></br>
        <h1>EMERALD BAY RESTAURANT</h1>
        <h3>Bringing the authentic Sri Lankan culinary experience to the Heart of Mirissa.</h3>
      </div><br></br>

      <div className="container about">
        <div style={{marginLeft:'20px', marginRight:'20px'}}>
          <h3>Two Simple reasons, One Simple Answer</h3><br></br>
          <h1>Why EMERALD BAY?</h1>
          <p>
            Designed to be the Culinary epicenter, We try to uphold the traditions of the Local Household while bringing
            out the flavors of Sri Lanka with a bounty of fresh seasonal ingredients. We take extra care to deliver fresh
            farm produce to a local classy table cuisine with an emphasis on seasonal & locally sourced ingredients and
            with the freshest Seafood.
          </p>
        </div>
        <div style={{marginRight:'20px'}}>
          <img src={aboutimg} alt="about food" />
        </div>
      </div><br></br>

      <div className="offersec" style={{display:'flex', height:'550px'}}>

      <div className="leftsection">
          <img  src={foodstock} style={{width:'900px', height:'550px'}} alt='foodstock'/>
      </div>

      <div className="rightsection" style={{backgroundColor:'black'}}>
           <h1 className='offerh1'>We Offer</h1> <br />
           <br />
           <h1 className='offerh12'>WONDERFUL <br /> FLAVOURS</h1>
           <hr className="flavours-line" />
           <p className="offerp">
           We want you to sit down and enjoy your meal just like the way you enjoy your homemade dishes! We have embarked on this journey and we are glad that you have taken the time off of your schedule to know our story to experience our experience.
           </p><br></br>
      </div>
      </div><br></br>

      <div style={{alignItems:'center', width:'1050px', marginLeft:'100px'}}>
        <ImageSlider slides={SliderData} />
      </div><br></br>

      <div className="review">
        <h1>Latest Reviews</h1><br></br>
        <div className="container">
          <img src={foodimg} alt="foodimg" />
          <div>
          <App feedbackDataList={feedbackList}/>
          </div>
        </div>
      </div>

      <div className="contact"><br></br><br></br>
      <h2>Contact Us</h2>
      <h1>STAY IN TOUCH</h1>
      <div className="border"></div>
      <br />
      <br />
      <FormExample />
    </div><br></br><br></br>

    

    <div class="feedback-section">
    <h2>Feedback</h2>
    <p>We value your feedback! Please take a moment to let us know about your experience.</p>
    <FeedbackForm />

    
</div>
<Footer />
</div>
  );
}

export default Home;
