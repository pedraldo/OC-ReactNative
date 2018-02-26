import React from 'react';
import SearchStackNavigator from './Navigation/Navigation'
import { StyleSheet } from 'react-native'

export default class App extends React.Component {
  render() {
    return (
      <SearchStackNavigator/>
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
