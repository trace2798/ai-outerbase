import { FC } from "react";
import { Button } from "./ui/button";

interface indexDatabaseProps {}

const IndexDatabase: FC<indexDatabaseProps> = ({}) => {
  const handleSubmit = async () => {
    await fetch("/api/update", {
      method: "POST",
    });
  };

  return (
    <>
      <Button onClick={() => handleSubmit()}>Index Docs</Button>
    </>
  );
};

export default IndexDatabase;
