import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ScrollBox } from '../src';

function randomColor(): string {
  switch (Math.floor(Math.random() * 3)) {
    case 0:
      return 'red';
    case 1:
      return 'green';
    case 2:
      return 'blue';
    default:
      return 'black';
  }
}

const Horizontal: React.FC = () => {
  return (
    <ScrollBox scrollDirection='horizontal'>
      <div style={{ display: 'inline-flex', width: "100%" }}>
        {
          Array.from(Array(100).keys()).map((key: number) => (
            <div key={key} style={{ backgroundColor: randomColor(), height: '10vh', minWidth: '100px' }} />
          ))
        }
      </div>
    </ScrollBox>
  );
}

const Vertical: React.FC = () => {
  return (
    <ScrollBox scrollDirection='vertical'>
      <div style={{ width: "40hh", height: '60vh' }}>
        {
          Array.from(Array(100).keys()).map((key: number) => (
            <div key={key} style={{ backgroundColor: randomColor(), height: '100px', minWidth: '100px' }} />
          ))
        }
      </div>
    </ScrollBox>
  );
}

const Both: React.FC = () => {
  return (
    <ScrollBox scrollDirection='both'>
      <div style={{ width: "40hh", height: '60vh' }}>
        {
          Array.from(Array(100).keys()).map((key: number) => (
            <div key={key} style={{ display: 'inline-flex' }}>
              {
                Array.from(Array(100).keys()).map((key2: number) => (
                  <div key={key2} style={{ backgroundColor: randomColor(), height: '100px', minWidth: '100px' }} />
                ))
              }
            </div>
          ))
        }
      </div>
    </ScrollBox>
  );
}

const App = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Horizontal</h1>
      <Horizontal />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '40vw', marginRight: '5vw' }}>
          <h1>Vertical</h1>
          <Vertical />
        </div>
        <div style={{ width:'40vw' }}>
          <h1>Both</h1>
          <Both />
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
