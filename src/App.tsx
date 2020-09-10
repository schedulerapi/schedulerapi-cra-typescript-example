import React, { useState, useEffect } from 'react';
import Scheduler from 'schedulerapi-js';

export interface SchedulerInputProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
}

const SchedulerInput = ({ name, value, onChange }: SchedulerInputProps): JSX.Element => {
  const id = name.replace(' ', '').toLowerCase();
  return <>
    <label htmlFor={id} className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2">{name}</label>
    <div className="mt-1 sm:mt-0 sm:col-span-2">
      <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
        <input
          onChange={(e) => onChange(e.target.value)}
          id={id}
          value={value}
          className="form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
        />
      </div>
    </div>
  </>
}

export interface SchedulerRadioProps<T> {
  name: string;
  value: T;
  options: { [value: string]: T; };
  onChange: (value: string) => void;
}

const SchedulerRadio = ({ name, value, options, onChange }: SchedulerRadioProps<string>): JSX.Element => {
  const id = name.replace(' ', '').toLowerCase();
  return <>
    <label htmlFor={id} className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2">{name}</label>
    <div className="mt-1 sm:mt-0 sm:col-span-2">
      <div className="max-w-lg rounded-md shadow-sm sm:max-w-xs">
        {Object.keys(options).map((k) => {
          const id = k.replace(' ', '').toLowerCase();
          return <div key={id} className="mt-4 flex items-center">
            <input id={id} value={k} checked={k === value} onChange={(e) => { onChange(e.target.value) }} name={name} type="radio" className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out" />
            <label htmlFor={id} className="ml-3">
              <span className="block text-sm leading-5 font-medium text-gray-700">{options[k]}</span>
            </label>
          </div>
        })}
      </div>
    </div>
  </>
}

const App = (): JSX.Element => {

  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '');
  const [body, setBody] = useState(localStorage.getItem('body') || '');
  const [method, setMethod] = useState(localStorage.getItem('method') || 'post');
  const [url, setUrl] = useState(localStorage.getItem('url') || '');
  const [when, setWhen] = useState(localStorage.getItem('when') || new Date().toISOString());
  const [results, setResults] = useState('');

  useEffect(() => { localStorage.setItem('apiKey', apiKey); setResults(''); }, [apiKey]);
  useEffect(() => { localStorage.setItem('body', body); setResults(''); }, [body]);
  useEffect(() => { localStorage.setItem('method', method); setResults(''); }, [method]);
  useEffect(() => { localStorage.setItem('url', url); setResults(''); }, [url]);
  useEffect(() => { localStorage.setItem('when', when); setResults(''); }, [when]);

  const schedule = () => {
    const s = new Scheduler({ key: apiKey });
    const payload = {
      when: new Date(when),
      url,
      method,
      body
    };
    s.scheduleWebhook(payload).then(response => {
      console.log('[scheduler response raw]', response);
      setResults(JSON.stringify(response));
    }).catch(err => { console.error('[scheduler response error]', err) });
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
          <div>
            <div className="mt-3 text-center">
              <h3 className="text-xl leading-5 font-medium text-gray-900" id="modal-headline">Scheduler API Example (webhook)</h3>
              <div className="mt-2">
                <p className="text-sm leading-5 text-gray-500">
                  This example will show you how to use the Scheduler API (with webhooks) in an React App.  This example uses Create React App, Typescript and Tailwind.  You will need a valid API key from <a href="https://www.schedulerapi.com">SchedulerAPI</a> to make this work.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 sm:mt-5 sm:pt-10">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Scheduling a Webhook</h3>
              <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">Use a valid URL, it will get a hit from the scheduler using the <strong>body</strong> and <strong>method</strong> you suggest at the point <strong>when</strong> occurs.</p>
            </div>
            <div className="mt-6 sm:mt-5">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <SchedulerInput name="API Key" value={apiKey} onChange={(v) => setApiKey(v)} />
              </div>

              <div className="mt-6 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <SchedulerInput name="Url" value={url} onChange={(v) => setUrl(v)} />
                <SchedulerRadio name="Method" value={method} onChange={(v) => setMethod(v)} options={{ get: 'GET', post: 'POST' }} />
                <SchedulerInput name="Body" value={body} onChange={(v) => setBody(v)} />
              </div>
              <div className="mt-6 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                <SchedulerInput name="When" value={when} onChange={(v) => setWhen(v)} />
              </div>

              {results !== '' &&
                <div className="mt-6 sm:mt-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Results</h3>
                  <pre>
                    {results}
                  </pre>
                </div>
              }

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:col-start-2">
                  <a href="https://www.schedulerapi.com" type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">Learn More</a>
                </span>
                <span className="flex w-full rounded-md shadow-sm sm:col-start-1">
                  <button onClick={() => schedule()} type="button" className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150 sm:text-sm sm:leading-5">Create Scheduled Event</button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
