import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { ChromeMessage, Sender } from './types';

import './App.css';

const App = () => {
	const [responseFromContent, setResponseFromContent] = useState<string>('');
	const [list, setList] = useState([
		{
			title: 'Loading...',
			thumbnail: 'https://via.placeholder.com/168x94',
			author: '...',
			time: '...'
		}
	]);
	/**
	 * Get current URL
	 */
	useEffect(() => {
		const queryInfo = { active: true, lastFocusedWindow: true };

		chrome.tabs &&
			chrome.tabs.query(queryInfo, tabs => {
				const url = tabs[0].url;
				// @ts-ignore
				setUrl(url);
			});
	}, []);

	/**
	 * Send message to the content script
	 */

	const sendRemoveMessage = () => {
		const message: ChromeMessage = {
			from: Sender.React,
			message: 'get the list'
		};

		const queryInfo: chrome.tabs.QueryInfo = {
			active: true,
			currentWindow: true
		};

		chrome.tabs &&
			chrome.tabs.query(queryInfo, tabs => {
				const currentTabId = tabs[0].id;
				// @ts-ignore
				chrome.tabs.sendMessage(currentTabId, message, response => {
					try {
						let data = JSON.parse(response);
						console.log({ data });
						setList(data.sort());
						if (
							data.length > 0 &&
							// @ts-ignore
							data.some(el => el.thumbnail == '')
						) {
							setTimeout(sendRemoveMessage, 100);
						}
						setResponseFromContent('ASDASDDone!');
					} catch (e) {
						setTimeout(sendRemoveMessage, 100);
						console.log('error', e);
					}
				});
			});
	};

	return (
		<div>
			<button onClick={sendRemoveMessage} className="get-list-btn">
				🚀 Get list
			</button>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				{list.map((el: any) => (
					<div
						key={el.title}
						onClick={() => {
							// open google in new tab
							window.open(
								`https://www.youtube.com/watch?v=${el.time}`,
								'_blank'
							);
						}}
						className="card"
					>
						<img src={el.thumbnail} />
						<div style={{ padding: '1rem' }}>
							<p>{el.title}</p>
							<div style={{ marginTop: '1rem' }}>
								<i>
									<span>{el.author}</span>
								</i>
								<span
									style={{
										position: 'absolute',
										right: '1rem'
									}}
								>
									{el.time}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
export default App;
