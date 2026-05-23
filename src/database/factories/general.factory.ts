import { General } from '../../entity/general.entity';

export function generalFatory(): General[] {
    const generals: General[] = [];

    const general = new General();
    general.add_body = 'Do some thing';
    general.add_header = 'Do some thing';
    general.address = 'Do some thing';
    general.company = 'admin@gmail.com';
    general.email = 'Do some thing';
    general.favicon = 'admin@gmail.com';
    general.hotline = 'admin@gmail.com';
    general.iframe_map = 'admin@gmail.com';
    general.social = { name: "'Do some thing'" };
    general.meta_title = 'Do some thing';
    general.meta_keyword = 'Do some thing';
    general.meta_description = 'Do some thing';
    general.logo = 'Do some thing';
    general.link_map = 'Do some thing';
    general.info = 'Do some thing';
    generals.push(general);

    return generals;
}
