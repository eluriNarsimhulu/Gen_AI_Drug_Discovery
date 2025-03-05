// import FaqItem from '../FaqItem'
import {Component} from 'react'
import './index.css'

const faqsList = [
    {
      id: 0,
      questionText: 'How does DrugSeek use Generative AI for medical diagnostics?',
      answerText: 'DrugSeek leverages advanced Generative AI models to analyze CT scans with high precision. Our AI algorithms can detect subtle patterns and abnormalities in lung imaging, assisting medical professionals in early disease detection and more accurate diagnoses.',
    },
    {
      id: 1,
      questionText: 'What types of lung diseases can your AI detect?',
      answerText: 'Our AI is trained to identify various lung conditions, including but not limited to lung cancer, pneumonia, tuberculosis, chronic obstructive pulmonary disease (COPD), and interstitial lung diseases. The system provides detailed analysis to support medical professionals in their diagnostic process.',
    },
    {
      id: 2,
      questionText: 'How accurate is your drug discovery platform?',
      answerText: 'Our drug discovery tools utilize state-of-the-art machine learning and generative AI algorithms. We\'ve developed sophisticated models for protein-ligand affinity prediction, protein structure analysis, and automated docking simulations that significantly reduce the time and cost of identifying potential drug candidates.',
    },
    {
      id: 3,
      questionText: 'Is my medical data secure when using DrugSeek?',
      answerText: 'We prioritize data security and privacy. Our platform is built on AWS cloud infrastructure with robust encryption protocols. We strictly adhere to HIPAA guidelines and implement multiple layers of security to protect sensitive medical and research data.',
    },
    {
      id: 4,
      questionText: 'How can pharmaceutical researchers benefit from your platform?',
      answerText: 'Researchers can leverage our AI-powered tools to accelerate drug discovery by:' +
        ' 1) Predicting protein-ligand interactions with high accuracy, 2) Modeling complex protein structures, ' +
        '3) Conducting automated docking simulations, and 4) Identifying promising drug candidates more efficiently than traditional methods.',
    },
    {
      id: 5,
      questionText: 'Do you offer custom AI solutions for specific research needs?',
      answerText: 'Yes, we provide tailored AI solutions for medical research institutions and pharmaceutical companies. Our team can develop custom machine learning models and generative AI tools specific to unique research requirements and disease areas.',
    },
    // {
    //   id: 6,
    //   questionText: 'What technologies power the DrugSeek platform?',
    //   answerText: 'We utilize a robust MERN (MongoDB, Express.js, React, Node.js) technology stack, combined with advanced machine learning and generative AI models. Our cloud infrastructure is powered by AWS, ensuring scalability, security, and real-time data processing.',
    // },
    // {
    //   id: 7,
    //   questionText: 'How quickly can your AI provide diagnostic insights?',
    //   answerText: 'Our AI can analyze CT scans and provide preliminary insights within minutes, dramatically reducing the time required for initial medical assessments. However, we always emphasize that AI is a supportive tool and final diagnoses should be made by qualified medical professionals.',
    // }
  ];
  


const PLUS_IMAGE =
  'https://assets.ccbp.in/frontend/react-js/faqs-plus-icon-img.png'
const MINUS_IMAGE =
  'https://assets.ccbp.in/frontend/react-js/faqs-minus-icon-img.png'

class FaqItem extends Component {
  state = {
    isActive: false,
  }

  renderAnswer = () => {
    const {faqDetails} = this.props
    const {answerText} = faqDetails
    const {isActive} = this.state

    if (isActive) {
      return (
        <div>
          <hr className="horizontal-line" />
          <p className="answer">{answerText}</p>
        </div>
      )
    }
    return null
  }

  onToggleIsActive = () => {
    this.setState(prevState => ({
      isActive: !prevState.isActive,
    }))
  }

  renderActiveImage = () => {
    const {isActive} = this.state
    const image = isActive ? MINUS_IMAGE : PLUS_IMAGE
    const altText = isActive ? 'minus' : 'plus'

    return (
      <button className="button" type="button" onClick={this.onToggleIsActive}>
        <img className="image" src={image} alt={altText} />
      </button>
    )
  }

  render() {
    const {faqDetails} = this.props
    const {questionText} = faqDetails

    return (
      <li className="faq-item">
        <div className="question-container">
          <h1 className="question">{questionText}</h1>
          {this.renderActiveImage()}
        </div>
        {this.renderAnswer()}
      </li>
    )
  }
}



const Faqs = props => {

  return (
    <div className="app-container">
      <div className="faqs-container">
        <h1 className="heading">FAQs</h1>
        <ul className="faqs-list">
          {faqsList.map(eachFaq => (
            <FaqItem key={eachFaq.id} faqDetails={eachFaq} />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Faqs
