import { Dir } from "../providers/PreferenceProvider"
import { ReactComponent as AlignRightIcon } from '../icons/align-right.svg'
import { cx } from "../lib/utils"
import { useTranslation } from "react-i18next"

interface AlignedTextAreaProps {
    value: string
    dir: Dir
    placeholder: string
    onChange: (text: string) => void
    onDirToggle: () => void
}

export default function AlignedTextArea({placeholder, dir, onChange, value, onDirToggle}: AlignedTextAreaProps) {
    const {i18n} = useTranslation()
    return (
        <div className="flex flex-col w-full min-h-[200px]">
            <AlignRightIcon onMouseDown={onDirToggle} className={cx("w-[20px] h-[20px] cursor-pointer ms-0.5", i18n.dir() === 'ltr' && 'self-end me-0.5' )} />
        <textarea
            dir={dir}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            value={value}
            className="textarea textarea-bordered flex-1"
            name=""
            id=""
        />
        </div>
    )
}