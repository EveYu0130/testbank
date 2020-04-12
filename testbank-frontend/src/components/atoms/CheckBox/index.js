import React from 'react';

class CheckBox extends React.Component {
    render() {
        const { checked, value, onChange } = this.props;
        return (
            <input type="checkbox" checked={checked} value={value} onChange={onChange} />
        )
    }
}

export default CheckBox;