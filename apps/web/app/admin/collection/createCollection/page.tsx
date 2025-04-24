'use client';
import CollectionForm from "../../../components/CollectionForm";
import Header from "../../../components/Header";
import NavBar from "../../../components/Navbar";

export default function CreateCollection() {

  return (
    <>
      <Header/>
      <NavBar/>
      <CollectionForm mode="create"/>
    </>
  );
}
