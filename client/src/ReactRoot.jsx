
import React, {useEffect} from 'react'
import { useState } from 'react'

export default function ReactRoot({ children }) {
    const [count, setCount] = useState(0)
    const [uhm, setUhm] = useState(false)

    useEffect(() => {
        setCount(count + uhm)
    }, [count])

    return (
        <>
            <div style={{ position: 'fixed', top: "10%", left: "3%" }}>
                <button onClick={() => (setCount(count+1), setUhm(!uhm))}>
                    count is {count}
                </button>
            </div>
        </>
    )
}
