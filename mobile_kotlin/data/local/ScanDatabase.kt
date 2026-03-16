package com.apkurl.blocker.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "scan_history")
data class ScanEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val name: String,
    val type: String, // "URL" or "APK"
    val riskLevel: String,
    val explanation: String,
    val timestamp: Long = System.currentTimeMillis()
)

@Dao
interface ScanDao {
    @Query("SELECT * FROM scan_history ORDER BY timestamp DESC")
    fun getAllHistory(): Flow<List<ScanEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertScan(scan: ScanEntity)

    @Query("DELETE FROM scan_history")
    suspend fun clearHistory()
}

@Database(entities = [ScanEntity::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun scanDao(): ScanDao
}
