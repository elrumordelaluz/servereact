import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { Link } from 'react-router';

const Index = (props) => {
  return (
    <div className={css(styles.message)}>
      Hello
      <Link to="/reddit">Reddit</Link>
    </div>
  );
}

export default Index;

const styles = StyleSheet.create({
  message: {
    color: 'red'
  }
});
