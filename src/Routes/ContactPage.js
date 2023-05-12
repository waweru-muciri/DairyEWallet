import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/PrivateLayout";
import { connect } from "react-redux";
import ContactInputForm from "../components/contacts/ContactInputForm";
import { withRouter } from "react-router-dom";

let ContactPage = ({contactToEdit}) => {
	const pageTitle = contactToEdit.id ? "Edit Farmer" : "New Farmer";

	return (
		<Layout pageTitle="Farmer Details">
			<Grid container justify="center" direction="column">
				<Grid item key={2}>
					<PageHeading  text={pageTitle} />
				</Grid>
				<Grid
					container
					direction="column"
					justify="center"
					item
					key={3}
				>
					<ContactInputForm contactToEdit={contactToEdit} />
				</Grid>
			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state, ownProps) => {
	return {
		contactToEdit: state.contacts.find(({ id }) => id === ownProps.match.params.contactId) || {},
	};
};

ContactPage = connect(mapStateToProps)(ContactPage);

export default withRouter(ContactPage);
