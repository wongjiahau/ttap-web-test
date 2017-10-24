import { connect } from "react-redux";
import {HelloWorldComponent, IHelloWorldComponentProps } from "../components/helloWorld";

const mapStateToProps = (state) : IHelloWorldComponentProps => {
  return {
    UserName :  state.userProfileReducer.FirstName
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export const HelloWorldContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(HelloWorldComponent);
