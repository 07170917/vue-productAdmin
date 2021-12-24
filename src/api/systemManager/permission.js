import request from '@/utils/request'

export function getData() {
    return request({
        url: '/admin/permission/findAllPermission',
        method: 'post',
    })
}

export function addAdminPermission(data) {
    return request({
        url: '/admin/permission/add',
        method: 'post',
        data
    })
}

export function deletePermission(data) {
    return request({
        url: '/admin/permission/delete',
        method: 'post',
        data
    })
}

export function findPermission(data) {
    return request({
        url: '/admin/permission/find',
        method: 'post',
        data
    })
}

export function editAdminPermission(data) {
    return request({
        url: '/admin/permission/edit',
        method: 'post',
        data
    })
}