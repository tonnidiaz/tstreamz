import axios from 'axios'
import Page from './p';
import {getHost} from '@repo/ui-next/lib/funcs'
import { isTuError } from '@cmn/utils/funcs';
import TuErrorPage from '@repo/ui-next/components/TuErrorPage';

const page = async ({params}) => {
    const {user} = await params
    const res = await fetch(await getHost() + `/api/hello/${user}`)
    const data = await res.json()

    if (!res.ok) {
        
        return <TuErrorPage status={res.status} msg={isTuError(data) || 'Something went wrong'}/>
    }
    return (
        <Page data={data}/>
    );
};

export default page;
