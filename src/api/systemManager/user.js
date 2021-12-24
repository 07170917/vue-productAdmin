import request from '@/utils/request'

export function getListData(query, page = 1, size = 10) {
    return request({
        url: '/admin/user/list',
        method: 'post',
        data: {
            ...query,
            page,
            size
        }
    })
}

export function addAdminUser(data) {
    return request({
        url: '/admin/user/add',
        method: 'post',
        data
    })
}
export function editAdminUser(data) {
    return request({
        url: '/admin/user/edit',
        method: 'post',
        data
    })
}
export function getAllRole() {
    return request({
        url: '/admin/role/getAllRole',
        method: 'post'
    })
}

export function deleteUser(data) {
    return request({
        url: '/admin/user/delete',
        method: 'post',
        data
    })
}