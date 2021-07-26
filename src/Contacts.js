import {useState, React, useEffect} from "react";
import {executeQuery} from "./rdf";
import "./Contacts.css";
import {useSession} from "@inrupt/solid-ui-react";
import PersonIcon from '@material-ui/icons/Person';

const getContactsBasicInfoQuery = "SELECT ?s ?o WHERE {?s <http://www.w3.org/2006/vcard/ns#fn> ?o}";

function Contacts(props) {
    let webId = props.webId;
    let gotoScreen = props.gotoScreen;
    let podURL = props.podUrl;

    const {session} = useSession();
    const [bindings, setBindings] = useState([]);


    async function fetchContacts() {
        let getContactsBasicInfoSource = podURL + "contacts/people.ttl#this";
        let resBindings = await executeQuery(getContactsBasicInfoQuery, [getContactsBasicInfoSource], session);
        await setBindings(resBindings);
    }

    useEffect(() => {
        fetchContacts();
    }, [webId]);

    function Contact(props) {
        let binding = props.binding;

        let username = binding['_root'].entries[1][1]['id'].replace(/['"]+/g, '');
        let turtleFileUrl = binding['_root'].entries[0][1]['id'].replace(/['"]+/g, '');

        return (
            <div className="contact">
                <PersonIcon/>
                <p className="contact-name"
                   onClick={() => gotoScreen(`/contacts/${username}`, [turtleFileUrl])}>{username}</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Contacts</h1>
            {bindings.map((binding, idx) => {
                console.log("Binding:", binding);
                return (<Contact key={idx} binding={binding}/>)
            })}
        </div>
    );
}

export default Contacts;