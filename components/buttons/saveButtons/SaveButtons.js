import React from 'react'
import { IconButton, Icon } from 'rsuite'

export default function SaveButton({
    onClick,
    children = 'บันทึกการแก้ไข',
    icon = 'save',
    disabled,
    ...props
}) {
    return (
        <IconButton
            appearance="ghost"
            className="rs-btn-ghost-save"
            style={{
                marginRight: 10,
                marginBottom: 10,
            }}
            onClick={onClick}
            icon={<Icon appearance="ghost" icon={icon} className="bt-gost-icon-radius" />}
            disabled={disabled}
            {...props}
        >
            {children}
        </IconButton>
    )
}
