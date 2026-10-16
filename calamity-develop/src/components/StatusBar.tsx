
import { charCount, wordCount } from "../notes/noteUtils";

interface StatusBarProps {
    content: string
}

function StatusBar(props: StatusBarProps) {

    const wordAmount = wordCount(props.content);
    const charAmount = charCount(props.content);

    return (
        <div>
            <p>
                words: {wordAmount}
            </p>
            <p>
                chars: {charAmount}
            </p>
        </div>
    )


}

export default StatusBar;