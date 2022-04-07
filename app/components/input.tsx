import React from 'react';
import styled from 'styled-components/native';
//Redux
// import { connect } from 'react-redux';
// import { signUp } from '../store/actions/userAction';
// import {AnyAction, bindActionCreators, Dispatch} from 'redux';

const Container = styled.View`
  min-width: 85%;
  align-self: center;
  background-color: white;
  border-radius: 24px;
  margin-top: 10px;
  border-width: 1.2px;
  border-color: lightgray;
`;

const CustomInput = styled.TextInput`
  padding: 15px;
  height: 48px;
  margin-right: 8px;
`;

interface Props {
  placeholder: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  onKeyPressed: () => void;
}

const Input: React.FC<Props> = props => {
  return (
    <Container>
      <CustomInput {...props} autoCapitalize="none" />
    </Container>
  );
};

// const mapStatetoProps = (state) => {
//   return {
//     User: state.User,
//   };
// };

// const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
//   return bindActionCreators({signUp}, dispatch);
// };

// export default connect(mapStatetoProps, mapDispatchToProps)(Input);

export default Input;
