package com.apkurl.blocker.data.repository

import com.apkurl.blocker.data.local.ScanDao
import com.apkurl.blocker.data.local.ScanEntity
import com.apkurl.blocker.data.remote.SecurityApiService
import com.apkurl.blocker.data.remote.UrlRequest
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.toRequestBody
import kotlinx.coroutines.flow.Flow

class ScanRepository(
    private val apiService: SecurityApiService,
    private val scanDao: ScanDao
) {
    val history: Flow<List<ScanEntity>> = scanDao.getAllHistory()

    suspend fun scanUrl(url: String): Result<ScanEntity> {
        return try {
            val response = apiService.scanUrl(UrlRequest(url))
            if (response.isSuccessful && response.body() != null) {
                val body = response.body()!!
                val entity = ScanEntity(
                    name = url,
                    type = "URL",
                    riskLevel = body.riskLevel,
                    explanation = body.explanation
                )
                scanDao.insertScan(entity)
                Result.success(entity)
            } else {
                Result.failure(Exception("API Error: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun scanApk(filePart: MultipartBody.Part, permissionsJson: String): Result<ScanEntity> {
        return try {
            val permsBody = permissionsJson.toRequestBody(MultipartBody.FORM)
            val response = apiService.scanApk(filePart, permsBody)
            if (response.isSuccessful && response.body() != null) {
                val body = response.body()!!
                val entity = ScanEntity(
                    name = filePart.body.toString(), // Simplified for example
                    type = "APK",
                    riskLevel = body.riskLevel,
                    explanation = body.explanation
                )
                scanDao.insertScan(entity)
                Result.success(entity)
            } else {
                Result.failure(Exception("API Error: ${response.code()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
