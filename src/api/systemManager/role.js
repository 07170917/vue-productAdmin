import request from '@/utils/request'

export function getListData(query, page = 1, size = 10) {
    return request({
        url: '/admin/role/list',
        method: 'post',
        data: {
            ...query,
            page,
            size
        }
    })
}
export function addAdminRole(data) {
    return request({
        url: '/admin/role/add',
        method: 'post',
        data
    })
}
export function editAdminRole(data) {
    return request({
        url: '/admin/role/edit',
        method: 'post',
        data
    })
}

export function deleteRole(data) {
    return request({
        url: '/admin/role/delete',
        method: 'post',
        data
    })
}

export function setRolePermission(data) {
    return request({
        url: '/admin/role/setRolePermission',
        method: 'post',
        data
    })
}

export function findRolePermission(data) {
    return request({
        url: '/admin/role/findRolePermission',
        method: 'post',
        data
    })
}