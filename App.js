/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Button, View, Text} from 'react-native';
// import { persistStore, autoRehydrate } from 'redux-persist' // 状态持久化
import {connect} from 'react-redux';
import dva from './dva';

const app = dva({
  initialState: {},
  models: [
    {
      namespace: 'stateA',
      state: 0,
      effects: {
        *addBoth({payload}, {call, put}) {
          console.log(payload);
          yield put({type: 'add'});
        },
      },
      reducers: {
        add(state) {
          return state + 1;
        },
      },
    },
    {
      namespace: 'stateB',
      state: 0,
      reducers: {
        add(state) {
          return state + 1;
        },
      },
      effects: {
        *addBoth(action, {call, put}) {
          yield put({type: 'add'});
        },
      },
    },
  ],
  extraEnhancers: [],
  onError(e) {
    console.log('onError', e);
  },
});

class App extends PureComponent {
  static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  add(type) {
    const {dispatch} = this.props;
    if (type === 'a') {
      dispatch({type: 'stateA/addBoth', payload: {token: ''}});
    } else {
      dispatch({type: 'stateB/addBoth'});
    }
  }

  render() {
    const {stateA, stateB} = this.props;
    return (
      <>
        <View style={{height: 20, backgroundColor: 'red'}}></View>
        <Button
          onPress={() => {
            this.add('a');
          }}
          title="a增加"
        />
        <Button
          onPress={() => {
            this.add('b');
          }}
          title="b增加"
        />
        <View>
          <Text>{stateA}</Text>
        </View>
        <View>
          <Text>{stateB}</Text>
        </View>
      </>
    );
  }
}

const MyApp = connect(({stateA, stateB}) => ({
  stateA,
  stateB,
}))(App);

export default app.start(<MyApp />);
