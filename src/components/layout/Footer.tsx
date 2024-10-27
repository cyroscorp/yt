import { IconCopyright } from "@tabler/icons-react";

export default function Footer() {
    function renderCurrentYear() {
        const year = new Date();
        return year.getFullYear();
    }

    return (
        <div className={`flex flex-col py-6 `}>
            <hr />
            <div className="flex flex-col md:flex-row items-start md:justify-between py-2">
                <div className="flex flex-row items-center space-x-1">
                    <IconCopyright size={16} />
                    <p>Marshall Blatz {renderCurrentYear()}</p>
                </div>
                <a href="https://blatz.io" target="_blank">
                    <p>blatz.io</p>
                </a>
            </div>
        </div>
    );
}
