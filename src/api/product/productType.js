import request from '@/utils/request'

export function getData() {
    return request({
        url: '/productType/getData',
        method: 'post',
    })
}

export function addProductType(data) {
    return request({
        url: '/productType/add',
        method: 'post',
        data
    })
}

export function deleteProductType(data) {
    return request({
        url: '/productType/delete',
        method: 'post',
        data
    })
}

export function findProductType(data) {
    return request({
        url: '/productType/find',
        method: 'post',
        data
    })
}

export function editProductType(data) {
    return request({
        url: '/productType/edit',
        method: 'post',
        data
    })
}