import React from 'react'
import { IconButton, Icon } from 'rsuite'
import AppContext from '../../../context/AppContext'

export default function CancelButton({
    onClick,
    children = 'ยกเลิกการแก้ไข',
    icon = 'close',
    disabled,
    hideChild = false,
    ...props
}) {
    const contextValue = React.useContext(AppContext)

    return (
        <IconButton
            appearance="ghost"
            className="rs-btn-ghost-cancel"
            style={{
                marginRight: 10,
                marginBottom: 10,
            }}
            onClick={onClick}
            icon={<Icon appearance="ghost" icon={icon} className="bt-gost-icon-radius-cancel" />}
            disabled={disabled}
            {...props}
        >
            {!hideChild && children}
        </IconButton>
    )
}
