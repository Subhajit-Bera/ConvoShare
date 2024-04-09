import React from "react";
import { Helmet } from "react-helmet-async";

const Title = ({
  title = "ConvoShare",
  description = "Let's engage in a deep conversation with ConvoShare",
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export default Title;
