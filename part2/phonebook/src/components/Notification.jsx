const Notification = ({ message: { msg, type } }) => {
    if (!msg) return null;

    const styles = {
        color: type ? 'green' : 'red',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }

    return (
        <div style={styles}>
            {msg}
        </div>
    );
}

export default Notification;