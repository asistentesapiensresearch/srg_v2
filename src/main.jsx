import './index.css'

import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'

import App from './App'; 
/*
import { Amplify } from 'aws-amplify';
import { I18n, parseAmplifyConfig } from "aws-amplify/utils";
import outputs from '../amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';
import { translations } from '@aws-amplify/ui-react';

const amplifyConfig = parseAmplifyConfig(outputs);
I18n.putVocabularies(translations);
I18n.setLanguage('es');

Amplify.configure(amplifyConfig);
*/

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
