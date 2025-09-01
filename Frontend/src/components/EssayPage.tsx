import { useEffect, useState } from "react";
import { EssayService } from "../services/essay.service";
import type { Essay } from "../interfaces/Essay";
import SideBar from "./SideBar";
import { Col, Row } from "react-bootstrap";
import UserCard from "./UserCard";
import type { User } from "../interfaces/User";
import EssayComponent from "./EssayComponent";

const EssayPage = () => {
  const [essay, setEssay] = useState<Essay | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const getById = async () => {
    const essayService = new EssayService();
    const response = await essayService.getById(2);

    if (response) {
      setEssay(response);
      setUser(response.user!);
    } else {
      setEssay(null);
    }
  };

  useEffect(() => {
    getById();
  }, []);

  return (
    <>
      {console.log(essay)}
      <div className="d-flex">
        <SideBar />
        <div className="mt-3 w-100 me-3">
          <Row className="mx-0">
            <Col md={9} className="p-3">
              <h6>The topic</h6>
              <hr />
            </Col>

            <Col md={3} className="p-0">
              <h6>The author</h6>
              <div className="p-3 rounded-3 bg-white">{user ? <UserCard {...user} /> : <p>Loading user...</p>}</div>
            </Col>

            <Col md={9} className="p-0">
              <h6>The essay</h6>
              <div className="p-3 rounded-3 bg-white">{essay ? <EssayComponent {...essay} /> : <p>Loading essay...</p>}</div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default EssayPage;
