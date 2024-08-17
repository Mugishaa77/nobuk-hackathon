
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faCakeCandles } from '@fortawesome/free-solid-svg-icons';


export default function Budgeting() {
    const mockData = {
        'Food and Beverages': [
            { name: 'Buffet', price: 6000, url: 'https://food1.example.com' },
            { name: 'Catering Service', price: 7000, url: 'https://food2.example.com' }
        ],
        'Decorations': [
            { name: 'Basic Decorations', price: 2000, url: 'https://www.carrefour.ke/mafken/en/v4/search?keyword=birthday%20decoration' },
            { name: 'Premium Decorations', price: 3000, url: 'https://decorations2.example.com' }
        ],
        'Entertainment': [
            { name: 'DJ Service', price: 4000, url: 'https://entertainment1.example.com' },
            { name: 'Live Band', price: 6000, url: 'https://entertainment2.example.com' }
        ],
        'Miscellaneous': [
            { name: 'Photographer', price: 3000, url: 'https://miscellaneous1.example.com' },
            { name: 'Party Favors', price: 1500, url: 'https://miscellaneous2.example.com' }
        ]
    };

    // Function to get the best options within the budget
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

    // Function to summarize and recommend the best options
    const summarizeAndRecommend = (options, budget) => {
        let recommendations = [];
        let totalSpent = 0;

        options.forEach(categoryInfo => {
            const { category, options } = categoryInfo;
            if (options.length > 0) {
                const bestOption = options[0];
                if (totalSpent + bestOption.price <= budget) {
                    recommendations.push(
                        `<strong>Category:</strong> ${category}<br />
                         <strong>Best Option:</strong> ${bestOption.name} at ${bestOption.price} shillings <button onclick="window.open('${bestOption.url}', '_blank')" style="margin-left: 10px;">Visit Page</button><br />`
                    );
                    totalSpent += bestOption.price;
                } else {
                    recommendations.push(`<strong>Category:</strong> ${category}<br />
                                           <strong>Best Option:</strong> Cannot afford within the remaining budget.<br />`);
                }
            } else {
                recommendations.push(`<strong>Category:</strong> ${category}<br />
                                       No options available within the budget.<br />`);
            }
        });

        const remainingBudget = budget - totalSpent;
        const summary = `<strong>Total Budget:</strong> ${budget} shillings<br />
                         <strong>Total Spent:</strong> ${totalSpent} shillings<br />
                         <strong>Remaining Budget:</strong> ${remainingBudget} shillings<br />` +
                         recommendations.join('<br />');

        return summary;
    };

    const [amount, setAmount] = useState('');
    const [numPeople, setNumPeople] = useState('');
    const [summary, setSummary] = useState('');

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
            <button onClick={handleGenerateSummary}>Generate Budget Summary</button>
            <div
                style={{ fontSize: '16px', color: '#333', fontFamily: "Montserrat", lineHeight: '1.5em', textAlign: 'center', padding:'1rem' }}
                dangerouslySetInnerHTML={{ __html: summary }}
            />
        </div>
    );
}
