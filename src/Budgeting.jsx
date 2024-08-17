
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faCakeCandles } from '@fortawesome/free-solid-svg-icons';

export default function Budgeting() {
    const mockData = {
        'Food and Beverages': [
            { name: 'Buffet', price: 6000, url: 'https://cheflink.co.ke' },
            { name: 'Catering Service', price: 7000, url: 'https://cheflink.co.ke' }
        ],
        'Decorations': [
            { name: 'Basic Decorations', price: 2000, url: 'https://www.carrefour.ke/mafken/en/v4/search?keyword=birthday%20decoration' },
            { name: 'Premium Decorations', price: 3000, url: 'https://decorations2.example.com' }
        ],
        'Entertainment': [
            { name: 'DJ Service', price: 4000, url: 'https://janeson.co.ke' },
            { name: 'Live Band', price: 6000, url: 'https://janeson.co.ke' }
        ],
        'Miscellaneous': [
            { name: 'Photographer', price: 3000, url: 'https://www.instagram.com/urbantakesprd/' },
            { name: 'Party Favors', price: 1500, url: 'https://www.jumia.co.ke/whiskey-2618/jameson/?srsltid=AfmBOorceqtROpIZPja14eZUVFI4O4DQGHFC1EV1Ro0GqyAuY40gXzFS' }
        ]
    };

    const getBestOptions = (budget, categoryData, numPeople) => {
        const allOptions = [];
        for (const [category, options] of Object.entries(categoryData)) {
            let filteredOptions = options;

            // Apply conditions based on the number of people
            if (category === 'Food and Beverages') {
                filteredOptions = numPeople > 100
                    ? options.filter(option => option.name === 'Catering Service')
                    : options.filter(option => option.name === 'Buffet');
            }

            if (category === 'Decorations') {
                filteredOptions = numPeople > 100
                    ? options.filter(option => option.name === 'Premium Decorations')
                    : options.filter(option => option.name === 'Basic Decorations');
            }

            if (category === 'Entertainment') {
                filteredOptions = numPeople > 100
                    ? options.filter(option => option.name === 'Live Band')
                    : options.filter(option => option.name === 'DJ Service');
            }

            if (category === 'Miscellaneous') {
                filteredOptions = numPeople > 100
                    ? options.filter(option => option.name === 'Photographer')
                    : options.filter(option => option.name === 'Party Favors');
            }

            const affordableOptions = filteredOptions.filter(option => option.price <= budget);
            const sortedOptions = affordableOptions.sort((a, b) => a.price - b.price);
            allOptions.push({ category, options: sortedOptions });
        }
        return allOptions;
    };

    const summarizeAndRecommend = (options, budget) => {
        let recommendations = [];
        let totalSpent = 0;
    
        options.forEach(categoryInfo => {
            const { category, options } = categoryInfo;
            if (options.length > 0) {
                const bestOption = options[0];
                if (totalSpent + bestOption.price <= budget) {
                    recommendations.push(
                        { type: 'text', content: `Category: ${category}` },
                        { type: 'text', content: `Best Option: ${bestOption.name} at ${bestOption.price} shillings` },
                        { type: 'button', content: `Visit Page`, url: bestOption.url }
                    );
                    totalSpent += bestOption.price;
                } else {
                    recommendations.push(
                        { type: 'text', content: `Category: ${category}` },
                        { type: 'text', content: `Best Option: Cannot afford within the remaining budget.` }
                    );
                }
            } else {
                recommendations.push(
                    { type: 'text', content: `Category: ${category}` },
                    { type: 'text', content: `No options available within the budget.` }
                );
            }
        });
    
        const remainingBudget = budget - totalSpent;
        const summary = [
            { type: 'text', content: `Total Budget: ${budget} shillings` },
            { type: 'text', content: `Total Spent: ${totalSpent} shillings` },
            { type: 'text', content: `Remaining Budget: ${remainingBudget} shillings` },
            ...recommendations
        ];
    
        return summary;
    };

    const [amount, setAmount] = useState('');
    const [numPeople, setNumPeople] = useState('');
    const [summary, setSummary] = useState([]);

    const handleGenerateSummary = () => {
        const budget = amount; // You can adjust this if you want to calculate per person
        const bestOptions = getBestOptions(budget, mockData, numPeople);
        const result = summarizeAndRecommend(bestOptions, budget);
        setSummary(result);
    };

    return (
        <div className="budget">
            <h1>Nobuk Budget</h1>
            <h2>Personalized Budgeting Tool <FontAwesomeIcon icon={faLightbulb} /></h2>
            <p>Effortlessly plan your budget based on your available funds and event requirements. Our tool provides tailored recommendations to help you make the most of your budget, ensuring every detail is covered.</p>
            <span className="lunch">e.g Birthday Lunch <FontAwesomeIcon icon={faCakeCandles} /></span>
            <div className="inputs">
                <div className="textbox">
                    <label>Amount:</label>
                    <input
                        className="form-control"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                    />
                </div>

                <div className="textbox">
                    <label>Number of People:</label>
                    <input
                        className="form-control"
                        type="number"
                        value={numPeople}
                        onChange={(e) => setNumPeople(Number(e.target.value))}
                    />
                </div>
            </div>
            <button onClick={handleGenerateSummary} className="generate">Generate Budget Summary</button>
            <ul className="summary">
                {summary.map((item, index) => (
                    item.type === 'text' ? (
                        <li key={index} className="summary-text">{item.content}</li>
                    ) : (
                        <li key={index} className="summary-button">
                            <button onClick={() => window.open(item.url, '_blank')}>
                                {item.content} <sup>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
  <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
</svg>
                                </sup>
                            </button>
                        </li>
                    )
                ))}
            </ul>
        </div>
    );
}
