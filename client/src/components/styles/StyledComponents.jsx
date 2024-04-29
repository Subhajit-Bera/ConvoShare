import { Skeleton, keyframes, styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";

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
    background-color: rgba(0, 0, 0, 0.1);
  }
`;


export {
  VisuallyHiddenInput, Link
};