import React from 'react';
import TabNavigator from './Navigation/Navigation'
import { StyleSheet } from 'react-native'
import { Provider } from 'react-redux'
import Store from './Store/configureStore'
import * as moment from 'moment'
import 'moment/locale/fr'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    moment.locale('fr')
  }
  render() {
    return (
      <Provider store={Store}>
        <TabNavigator/>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
