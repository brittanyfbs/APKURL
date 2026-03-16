package com.apkurl.blocker.data.remote

import retrofit2.Response
import retrofit2.http.*
import okhttp3.MultipartBody
import okhttp3.RequestBody

data class UrlRequest(val url: String)

data class ScanResponse(
    val riskLevel: String,
    val explanation: String,
    val detectedIssues: List<String>
)

interface SecurityApiService {
    @POST("api/v1/scan/url")
    suspend fun scanUrl(@Body request: UrlRequest): Response<ScanResponse>

    @Multipart
    @POST("api/v1/scan/apk")
    suspend fun scanApk(
        @Part file: MultipartBody.Part,
        @Part("permissions") permissions: RequestBody
    ): Response<ScanResponse>
}
