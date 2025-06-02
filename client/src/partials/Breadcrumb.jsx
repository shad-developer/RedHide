import { FaArrowRight } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
    const location = useLocation();
    const { pathname } = location;

    const pathnames = pathname.split('/').filter(x => x);

    const formatWord = (word) => {
        return word
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
    };

    return (
        <nav className="text-sm text-gray-600">
            <ol className="flex space-x-2 items-center">
                <li>
                    <Link to="/" className="hover:underline font-medium">Home</Link>
                </li>
                {pathnames.map((name, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;
                    return (
                        <li key={index} className="flex items-center gap-2">
                            <FaArrowRight />
                            {isLast ? (
                                <span className="text-gray-800 font-medium">{formatWord(name)}</span>
                            ) : (
                                <Link to={routeTo} className="hover:underline">{formatWord(name)}</Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
