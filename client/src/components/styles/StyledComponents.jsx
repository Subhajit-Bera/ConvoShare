import { Skeleton, keyframes, styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";
import { bgc,grayColor } from "../../constants/color";

//We are passing input element inside the styled component and give it style
const VisuallyHiddenInput = styled("input")({
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

const Link = styled(LinkComponent)`
  text-decoration: none;
  color: black;
  ${'' /* padding: 1rem; */}
  &:hover {
    ${'' /* background-color: rgba(0, 0, 0, 0.1); */}
    background-color: ${bgc};
    ${'' /* border-top: 2px solid #99BC85 ;
    border-bottom: 2px solid #99BC85 ; */}
    box-shadow:0px 10px 20px rgba(0, 0, 0, 0.3);
  }
`;

const InputBox = styled("input")`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 0 3rem;
  border-radius: 1.5rem;
  background-color: ${grayColor};
`;

export {
  VisuallyHiddenInput, Link,
  InputBox
};



