import React from 'react';
import { StyleSheet, css } from 'aphrodite';

const Index = (props) => {
  return (
    <div className={css(styles.message)}>Hello!</div>
  );
}

export default Index;

const styles = StyleSheet.create({
  message: {
    color: 'red'
  }
});
